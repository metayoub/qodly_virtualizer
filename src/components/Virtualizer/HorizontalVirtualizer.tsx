import { FC } from 'react';
import { Element } from '@ws-ui/craftjs-core';
import cn from 'classnames';
import { EntityProvider } from '@ws-ui/webform-editor';
import { IVirtualizer } from './Virtualizer.config';
import { useVirtualizer } from '@tanstack/react-virtual';

const HorizontalVirtualizer: FC<IVirtualizer> = ({
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
  const virtualizer = useVirtualizer({
    horizontal: true,
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
        className="virtualizer-list"
        style={{ height: '100%', width: '100%', overflowY: 'auto' }}
      >
        <div
          style={{
            width: virtualizer.getTotalSize(),
            height: '100%',
            position: 'relative',
          }}
        >
          {items.map((virtualColumn) => (
            <div
              key={virtualColumn.key}
              data-index={virtualColumn.index}
              ref={virtualizer.measureElement}
              className={cn('virtualizer-item', {
                selected: virtualColumn.index === selected,
                'bg-purple-200': virtualColumn.index === selected,
                'virtualizer-item-odd': virtualColumn.index % 2 === 0,
                'virtualizer-item-even': virtualColumn.index % 2 === 1,
              })}
              onClick={() => handleClick(virtualColumn.index)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                transform: `translateX(${virtualColumn.start}px)`,
              }}
            >
              <EntityProvider
                index={virtualColumn.index}
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
  );
};

export default HorizontalVirtualizer;
