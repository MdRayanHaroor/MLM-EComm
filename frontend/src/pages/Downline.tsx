import { useState, useEffect } from 'react'
import { userService } from '../services/wallet'
import { MatrixNode } from '../types'

export default function Downline() {
  const [tree, setTree] = useState<MatrixNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDownline()
  }, [])

  const loadDownline = async () => {
    try {
      const data = await userService.getDownline()
      setTree(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  const renderNode = (node: MatrixNode, depth: number = 0) => (
    <div key={node.user_id} className={`ml-${depth * 4}`}>
      <div className="flex items-center gap-2 p-2 bg-white rounded shadow-sm mb-2">
        <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold">
          {node.position}
        </span>
        <div>
          <p className="font-medium text-sm">{node.full_name || 'Empty Slot'}</p>
          <p className="text-xs text-gray-500">
            L{node.level} | PV: {node.pv_balance} | {node.current_rank}
          </p>
        </div>
        <span className={`ml-auto text-xs px-2 py-1 rounded ${
          node.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {node.status}
        </span>
      </div>
      {node.children?.map((child) => renderNode(child, depth + 1))}
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Downline</h1>

      <div className="bg-gray-50 p-4 rounded-lg">
        {tree.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No downline yet. Start referring people!</p>
        ) : (
          tree.map((node) => renderNode(node))
        )}
      </div>
    </div>
  )
}
