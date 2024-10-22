import { FC } from 'react';
import { Element } from '@ws-ui/craftjs-core';
import cn from 'classnames';
import { EntityProvider } from '@ws-ui/webform-editor';
import { IVirtualizer } from './Virtualizer.config';
import { useVirtualizer } from '@tanstack/react-virtual';

const VerticalVirtualizer: FC<IVirtualizer> = ({
  style,
  className,
  classNames,
  iterator,
  connect,
  selected,
  ds,
  currentDs,
  parentRef,
  handleClick,
  resolver,
  count,
}) => {
  const virtualizer = useVirtualizer({
    count: count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
  });
  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={connect}
      style={style}
      id="virtualizer"
      className={cn('w-fit h-fit', className, classNames)}
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
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${items[0]?.start ?? 0}px)`,
            }}
          >
            {items.map((virtualRow) => (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={cn('virtualizer-item', {
                  selected: virtualRow.index === selected,
                  'bg-purple-200': virtualRow.index === selected,
                  'virtualizer-item-odd': virtualRow.index % 2 === 0,
                  'virtualizer-item-even': virtualRow.index % 2 === 1,
                })}
                onClick={() => handleClick(virtualRow.index)}
              >
                <EntityProvider
                  index={virtualRow.index}
                  selection={ds}
                  current={currentDs?.id}
                  iterator={iterator}
                >
                  <Element
                    id="element"
                    className="h-full w-full "
                    role="element"
                    is={resolver.StyleBox}
                    canvas
                  />
                </EntityProvider>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalVirtualizer;
