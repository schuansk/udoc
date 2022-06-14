export type Block = {
  blockquote: string;
  unordered: string;
  ordered: string;
  code: string;
};

export const BlockStyles: Block = {
  blockquote: 'blockquote',
  unordered: 'unordered-list-item',
  ordered: 'ordered-list-item',
  code: 'code-block',
};

export function getBlockStyle(block: { getType: () => unknown }) {
  if (block.getType() === 'blockquote') {
    return 'RichEditor-blockquote';
  }
  return null;
}
