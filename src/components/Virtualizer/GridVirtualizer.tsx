import { FC, useLayoutEffect, useRef } from 'react';
import { Element } from '@ws-ui/craftjs-core';
import cn from 'classnames';
import { EntityProvider } from '@ws-ui/webform-editor';
import { IVirtualizer } from './Virtualizer.config';
import { useWindowVirtualizer, useVirtualizer } from '@tanstack/react-virtual';

const GridVirtualizer: FC<IVirtualizer> = ({
  style,
  className,
  classNames,
  iterator,
  connect,
  selected,
  ds,
  currentDs,
  parentRef,
  count,
  handleClick,
  resolver,
  columns = 4,
}) => {
  const parentOffsetRef = useRef(0);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useVirtualizer({
    count: Math.floor(count / columns) + 1,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 450,
  });

  const columnVirtualizer = useWindowVirtualizer({
    count: columns,
    scrollMargin: parentOffsetRef.current,

    estimateSize: () => 45,
  });

  const columnItems = columnVirtualizer.getVirtualItems();

  return (
    <div
      ref={connect}
      style={style}
      id="virtualizer"
      className={cn('w-fit h-fit', className, classNames)}
    >
      <div
        ref={parentRef}
        className="virtualizer-list"
        style={{ height: '100%', width: '100%', overflowY: 'auto' }}
      >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((row) => (
            <div
              key={row.key}
              data-index={row.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `translateY(${row.start - virtualizer.options.scrollMargin}px)`,
                display: 'flex',
              }}
            >
              {columnItems.map((column) => {
                return (
                  <div
                    key={column.key}
                    style={{
                      width: 'fit-content',
                      height: 'fit-content',
                    }}
                    className={cn('virtualizer-item', {
                      selected: row.index * columns + column.index === selected,
                      'bg-purple-200': row.index * columns + column.index === selected,
                      'virtualizer-item-odd': row.index * columns + (column.index % 2) === 0,
                      'virtualizer-item-even': row.index * columns + (column.index % 2) === 1,
                    })}
                    onClick={() => handleClick(row.index * columns + column.index)}
                  >
                    {row.index * columns + column.index < count ? (
                      <EntityProvider
                        index={row.index * columns + column.index}
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
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridVirtualizer;
