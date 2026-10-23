// Architecture diagrams generated from case-studies.json: layers of nodes plus numbered
// interactions. Labels come from the dictionaries, so the diagram switches language with
// the rest of the page, and the text alternative is derived from the same data.
import { h } from '../dom.js';

const nodeLabel = (study, t, id) => t(`caseStudies.${study.id}.nodes.${id}`);

export function describeDiagram(study, t) {
  const nodes = study.layers.flatMap((layer) => layer.nodes.map((node) => ({ ...node, layer: layer.id })));
  const components = nodes.map((node) => {
    const owner = node.ownedBy ? `, ${t('ui.caseStudy.ownedBy')} ${nodeLabel(study, t, node.ownedBy)}` : '';
    return `${t(`ui.layers.${node.layer}`)}: ${nodeLabel(study, t, node.id)} (${node.tech})${owner}`;
  });
  const interactions = study.interactions.map((interaction) => {
    const from = interaction.from.map((id) => nodeLabel(study, t, id)).join(', ');
    const to = interaction.to.map((id) => nodeLabel(study, t, id)).join(', ');
    const label = t(`caseStudies.${study.id}.interactions.${interaction.id}`);
    return `${from} → ${to}: ${label} (${t(`ui.interactionKinds.${interaction.kind}`)})`;
  });
  return { components, interactions };
}

function flowNumbers(study, nodeId) {
  return study.interactions
    .map((interaction, index) => (interaction.from.includes(nodeId) ? index + 1 : null))
    .filter(Boolean);
}

function renderNode(study, node, t) {
  const numbers = flowNumbers(study, node.id);
  return h('div', { class: 'diagram__node', 'data-node': node.id, 'data-flows': numbers.join(' ') || null },
    h('span', { class: 'diagram__node-label' }, nodeLabel(study, t, node.id)),
    h('span', { class: 'diagram__node-tech' }, node.tech),
    numbers.length
      ? h('span', { class: 'diagram__node-flows', 'aria-hidden': 'true' }, numbers.map((n) => h('span', { class: 'flow-badge' }, n)))
      : null);
}

export function renderDiagram(study, { t }) {
  const descriptionId = `diagram-description-${study.id}`;
  const { components, interactions } = describeDiagram(study, t);

  return h('figure', { class: 'diagram', 'data-diagram': study.id },
    h('figcaption', { class: 'diagram__caption' },
      h('span', {}, t('ui.caseStudy.diagram')),
      h('span', { class: 'diagram__hint' }, t('ui.caseStudy.panHint'))),
    h('div', {
      class: 'diagram__frame', tabindex: 0, role: 'img',
      'aria-label': `${t('ui.caseStudy.diagram')}: ${t(`caseStudies.${study.id}.title`)}`,
      'aria-describedby': descriptionId,
    },
    h('div', { class: 'diagram__canvas' },
      study.layers.map((layer) => h('div', { class: 'diagram__layer', 'data-layer': layer.id },
        h('span', { class: 'diagram__layer-label' }, t(`ui.layers.${layer.id}`)),
        h('div', { class: 'diagram__nodes' }, layer.nodes.map((node) => renderNode(study, node, t))))))),
    h('ol', { class: 'diagram__flows' },
      study.interactions.map((interaction, index) => h('li', {
        class: 'diagram__flow', 'data-kind': interaction.kind, 'data-flow': index + 1,
        'data-nodes': [...interaction.from, ...interaction.to].join(' '),
      },
      h('span', { class: 'flow-badge' }, index + 1),
      h('span', {}, interactions[index])))),
    h('details', { class: 'diagram__description', id: descriptionId },
      h('summary', {}, t('ui.caseStudy.diagramDescription')),
      h('h5', {}, t('ui.caseStudy.components')),
      h('ul', {}, components.map((text) => h('li', {}, text))),
      h('h5', {}, t('ui.caseStudy.interactions')),
      h('ol', {}, interactions.map((text) => h('li', {}, text)))));
}
