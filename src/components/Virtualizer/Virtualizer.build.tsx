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

const Virtualizer: FC<IVirtualizerProps> = ({
  orientation = 'vertical',
  style,
  className,
  classNames = [],
}) => {
  const {
    connectors: { connect },
  } = useEnhancedNode();
  useDatasourceSub();
  const parentRef = useRef(null);
  const { resolver } = useEnhancedEditor(selectResolver);
  const virtualizer = useVirtualizer({
    horizontal: orientation === 'horizontal',
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (orientation === 'horizontal' ? 100 : 45),
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
          overflow: 'auto',
          contain: 'strict',
        }}
      >
        <div
          style={
            orientation === 'vertical'
              ? {
                  height: `fit-content`,
                  width: '100%',
                  position: 'relative',
                }
              : {
                  width: `fit-content`,
                  height: '100%',
                  position: 'relative',
                }
          }
        >
          {items.map((virtualRow) => (
            <div
              key={virtualRow.index}
              className={`virtualizer-item ${virtualRow.index % 2 ? 'virtualizer-item-odd' : 'virtualizer-item-even'}`}
              style={
                orientation === 'vertical'
                  ? {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${items[0]?.start ?? 0}px)`,
                    }
                  : {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      transform: `translateX(${items[0]?.start ?? 0}px)`,
                    }
              }
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
