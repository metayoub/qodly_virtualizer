import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  styleboxWidth,
}) => {
  const parentOffsetRef = useRef(0);
  const [parentWidth, setParentWidth] = useState(0);
  const [calculateColumns, setCalculateColumns] = useState(columns);
  const [columnWidth, setColumnWidth] = useState(0);
  useEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]) => {
      const { width } = entries[0].contentRect;
      setParentWidth(width);
    };

    const resizeObserver = new ResizeObserver(handleResize);

    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);

      // Set initial dimensions
      const { offsetWidth } = parentRef.current;
      setParentWidth(offsetWidth);
    }

    return () => resizeObserver.disconnect(); // Clean up observer on unmount
  }, []);

  useEffect(() => {
    const calculateColumns = () => {
      if (columns === 0) {
        if (typeof styleboxWidth === 'string') {
          if (styleboxWidth.includes('%')) {
            // Handle percentage-based width
            const percentage = parseFloat(styleboxWidth) / 100;
            const columnWidth = parentWidth * percentage;
            setColumnWidth(columnWidth);
            return Math.floor(parentWidth / columnWidth);
          } else if (styleboxWidth.includes('px')) {
            // Handle fixed pixel-based width
            const fixedWidth = parseFloat(styleboxWidth);
            setColumnWidth(fixedWidth);
            return Math.floor(parentWidth / fixedWidth);
          }
        }
      }
      return columns;
    };

    const calculatedColumns = calculateColumns();
    setCalculateColumns(calculatedColumns);
  }, [styleboxWidth, parentWidth, columns]);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useVirtualizer({
    count: Math.floor(count / calculateColumns) + 1,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 450,
  });

  const columnVirtualizer = useWindowVirtualizer({
    count: calculateColumns,
    scrollMargin: parentOffsetRef.current,

    estimateSize: () => columnWidth,
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
                      width: columnWidth ? columnWidth : 'fit-content',
                      height: 'fit-content',
                    }}
                    className={cn('virtualizer-item', {
                      selected: row.index * calculateColumns + column.index === selected,
                      'bg-purple-200': row.index * calculateColumns + column.index === selected,
                      'virtualizer-item-odd':
                        row.index * calculateColumns + (column.index % 2) === 0,
                      'virtualizer-item-even':
                        row.index * calculateColumns + (column.index % 2) === 1,
                    })}
                    onClick={() => handleClick(row.index * calculateColumns + column.index)}
                  >
                    {row.index * calculateColumns + column.index < count ? (
                      <EntityProvider
                        index={row.index * calculateColumns + column.index}
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
