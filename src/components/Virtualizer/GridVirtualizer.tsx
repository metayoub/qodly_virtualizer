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
}) => {
  const parentOffsetRef = useRef(0);

  const getColumnWidth = (index: number) => 350;

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: count,
    overscan: 5,
    scrollMargin: parentOffsetRef.current,
    estimateSize: () => 450,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: 5,
    getScrollElement: () => parentRef.current,
    estimateSize: getColumnWidth,
    overscan: 5,
  });

  const columnItems = columnVirtualizer.getVirtualItems();
  const [before, after] =
    columnItems.length > 0
      ? [
          columnItems[0].start,
          columnVirtualizer.getTotalSize() - columnItems[columnItems.length - 1].end,
        ]
      : [0, 0];
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
              <div style={{ width: `${before}px` }} />
              {columnItems.map((column) => {
                return (
                  <div
                    key={column.key}
                    style={{
                      minHeight: row.index === 0 ? 50 : row.size,
                      width: getColumnWidth(column.index),
                    }}
                  >
                    <EntityProvider
                      index={column.index + row.index}
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
                );
              })}
              <div style={{ width: `${after}px` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridVirtualizer;
