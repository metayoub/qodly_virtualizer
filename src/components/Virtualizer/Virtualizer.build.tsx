import {
  selectResolver,
  useDatasourceSub,
  useEnhancedEditor,
  useEnhancedNode,
  IteratorProvider,
} from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { IVirtualizerProps } from './Virtualizer.config';
import { Element } from '@ws-ui/craftjs-core';

const Virtualizer: FC<IVirtualizerProps> = ({ style, className, classNames = [] }) => {
  const {
    connectors: { connect },
  } = useEnhancedNode();
  useDatasourceSub();
  const parentRef = useRef(null);
  const { resolver } = useEnhancedEditor(selectResolver);
  const virtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={connect}
      style={style}
      id="virtualizer"
      className={cn('virtualizer w-fit h-fit border border-gray-300', className, classNames)}
    >
      <div
        ref={parentRef}
        id="virtualizer-list"
        className="virtualizer-list"
        style={{
          height: '100%',
          width: '100%',
          overflowY: 'auto',
          contain: 'strict',
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {items.map((virtualRow) => (
            <div
              key={virtualRow.index}
              className={`virtualizer-item ${virtualRow.index % 2 ? 'virtualizer-item-odd' : 'virtualizer-item-even'}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${items[0]?.start ?? 0}px)`,
              }}
            >
              {virtualRow.index === 0 ? (
                <IteratorProvider>
                  <Element
                    id="element"
                    className="w-full h-full"
                    role="element"
                    is={resolver.StyleBox}
                    deletable={false}
                    canvas
                  />
                </IteratorProvider>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Virtualizer;
