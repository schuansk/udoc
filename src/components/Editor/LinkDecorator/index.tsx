import { CompositeDecorator } from 'draft-js';

function DraftLink(props: any) {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={`//${url}`} target="_blank" rel="noreferrer">
      {props.children}
    </a>
  );
}

export function findLinkEntities(
  contentBlock: any,
  callback: any,
  contentState: any,
) {
  contentBlock.findEntityRanges((character: { getEntity: () => any }) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, callback);
}

const createLinkDecorator = () =>
  new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: DraftLink,
    },
  ]);

export default createLinkDecorator;
