import axe from 'axe-core'

// Runs axe, an automatic accessibility checker, over whatever a test
// rendered, and returns one readable line per problem (empty = none found).
// Colour contrast and page-level rules are switched off: jsdom can't
// compute colours, and a test renders a fragment, not a whole page.
export async function a11yProblems(container: Element): Promise<string[]> {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      region: { enabled: false },
    },
  })
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length}×)`)
}
