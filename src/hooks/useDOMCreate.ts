import { onUnmounted } from 'vue'

function useDOMCreate(nodeId: string) {
  let node = document.getElementById(nodeId) as null | HTMLElement
  if (!node) {
    node = document.createElement('div')
  }

  node.id = nodeId
  document.body.appendChild(node)
  onUnmounted(() => {
    document.body.removeChild(node!)
  })

  return {
    node,
  }
}

export default useDOMCreate
