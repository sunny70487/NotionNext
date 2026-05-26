/**
 * Notion 数据格式清理工具
 * notion-client@6.15.x 回傳 nested value 結構:
 *   block[id] = { spaceId, value: { value: {id, type, ...}, role } }
 * react-notion-x 預期:
 *   block[id] = { value: {id, type, ...} }
 *
 * 此函數遍歷 recordMap 的 block / collection 並 unwrap 成舊版格式
 */

function unwrapValue(obj) {
  if (!obj) return obj

  // 新格式: { spaceId, value: { value: { id, type, ... }, role } }
  if (obj?.value?.value?.id && obj?.value?.role) {
    return obj.value.value
  }

  // 次新格式: { value: { id, type, ... }, role }
  if (obj?.value?.id && obj?.role !== undefined) {
    return obj.value
  }

  // 旧格式: { value: { id, type, ... } } 直接取 value
  if (obj?.value?.id) {
    return obj.value
  }

  // 兜底
  return obj?.value ?? obj
}

/**
 * 適配 recordMap，讓 react-notion-x 能正確讀取
 * @param {object} recordMap - notion-client getPage 回傳的 recordMap
 * @returns {object} normalized recordMap
 */
export function adapterNotionBlockMap(recordMap) {
  if (!recordMap) return recordMap

  const cleanedBlocks = {}
  for (const [id, block] of Object.entries(recordMap.block || {})) {
    cleanedBlocks[id] = { value: unwrapValue(block) }
  }

  const cleanedCollection = {}
  for (const [id, collection] of Object.entries(recordMap.collection || {})) {
    cleanedCollection[id] = { value: unwrapValue(collection) }
  }

  return {
    ...recordMap,
    block: cleanedBlocks,
    collection: cleanedCollection
  }
}
