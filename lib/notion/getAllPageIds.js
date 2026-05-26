import BLOG from "@/blog.config"

export default function getAllPageIds(collectionQuery, collectionId, collectionView, viewIds, block = {}) {
  const pageSet = new Set()
  const targetViewId = viewIds?.[BLOG.NOTION_INDEX || 0]

  if (collectionView && targetViewId) {
    let viewData = collectionView?.[targetViewId]?.value
    if (viewData && !viewData.type && viewData.value) viewData = viewData.value
    const pageSort = viewData?.page_sort
    if (Array.isArray(pageSort) && pageSort.length > 0) {
      pageSort.forEach(id => pageSet.add(id))
    }
  }

  if (collectionQuery && collectionId) {
    const viewQuery = collectionQuery?.[collectionId]
    if (viewQuery) {
      const selectedViewData = targetViewId ? viewQuery[targetViewId] : null
      const queryData = selectedViewData ? [selectedViewData] : Object.values(viewQuery)
      queryData.forEach(viewData => {
        [
          viewData?.collection_group_results?.blockIds,
          viewData?.results?.blockIds,
          viewData?.blockIds,
        ].forEach(ids => {
          if (Array.isArray(ids)) ids.forEach(id => pageSet.add(id))
        })
      })
    }
  }

  return [...pageSet]
}
