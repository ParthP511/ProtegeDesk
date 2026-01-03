'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOntology } from '@/lib/ontology/context'
import { cn } from '@/lib/utils'
import type { OntologyClass } from '@/lib/ontology/types'
import debug from 'debug'

const logger = debug('app:class-tree')

type ClassTreeNodeProps = {
  classId: string
  owlClass: OntologyClass
  level: number
}

function ClassTreeNode({ classId, owlClass, level }: ClassTreeNodeProps) {
  const { ontology, selectedClass, selectClass, selectProperty, selectIndividual } = useOntology()
  const [isExpanded, setIsExpanded] = useState(true)

  // Find subclasses
  const subclasses = Array.from(ontology?.classes.values() || []).filter(ontologyClass =>
    ontologyClass.superClasses.includes(classId)
  )

  logger('Rendering class node', {
    classId,
    label: owlClass.label || owlClass.name,
    level,
    hasChildren: subclasses.length > 0,
    isExpanded,
  })

  const hasChildren = subclasses.length > 0
  const isSelected = selectedClass?.id === classId

  return (
    <div>
      <div
        className={cn(
          'group hover:bg-accent flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-sm',
          isSelected && 'bg-primary/20 text-primary'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          logger('Class selected', {
            classId,
            className: owlClass.label || owlClass.name,
          })
          // Clear other selections to ensure only the class is selected
          selectProperty(null)
          selectIndividual(null)
          selectClass(classId)
        }}
      >
        {hasChildren ? (
          <button
            onClick={e => {
              e.stopPropagation()
              logger('Toggle expand/collapse', {
                className: owlClass.label || owlClass.name,
                wasExpanded: isExpanded,
                willBeExpanded: !isExpanded,
              })
              setIsExpanded(!isExpanded)
            }}
            className="flex h-4 w-4 items-center justify-center"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <span className="flex-1 font-mono text-xs">{owlClass.label || owlClass.name}</span>
        <div className="hidden items-center gap-1 group-hover:flex">
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <Plus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {subclasses.map(subclass => (
            <ClassTreeNode
              key={subclass.id}
              classId={subclass.id}
              owlClass={subclass}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ClassTree() {
  const { ontology } = useOntology()

  // Find root classes (those with no superclasses or only owl:Thing)
  const rootClasses = Array.from(ontology?.classes.values() || []).filter(
    ontologyClass =>
      ontologyClass.superClasses.length === 0 ||
      (ontologyClass.superClasses.length === 1 && ontologyClass.superClasses[0] === 'owl:Thing')
  )

  logger('Rendering with class tree', {
    totalClasses: ontology?.classes.size || 0,
    rootClassCount: rootClasses.length,
    rootClasses: rootClasses.map(rootClass => rootClass.label || rootClass.name),
  })

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex items-center justify-between border-b px-3 py-2">
        <h3 className="text-sm font-semibold">Classes</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {rootClasses.map(rootClass => (
          <ClassTreeNode key={rootClass.id} classId={rootClass.id} owlClass={rootClass} level={0} />
        ))}
      </div>
    </div>
  )
}
