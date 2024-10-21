import {
  selectResolver,
  useEnhancedEditor,
  useRenderer,
  useSources,
  EntityProvider,
  useDataLoader,
} from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { IVirtualizerProps } from './Virtualizer.config';
import { Element } from '@ws-ui/craftjs-core';

const Virtualizer: FC<IVirtualizerProps> = ({ iterator, style, className, classNames = [] }) => {
  const { connect } = useRenderer();
  const parentRef = useRef(null);
  const [length, setLength] = useState(() => 0);
  const {
    sources: { datasource: ds, currentElement: currentDs },
  } = useSources();
  const { fetchIndex } = useDataLoader({
    source: ds,
  });

  const { resolver, query } = useEnhancedEditor(selectResolver);

  const virtualizer = useVirtualizer({
    count: length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    enabled: true,
  });

  const items = virtualizer.getVirtualItems();

  useEffect(() => {
    // useEffect to fetch data for the first Time
    if (!ds) return;
    const init = async () => {
      const selLength = await ds.getValue('length');
      setLength(selLength);
      await fetchIndex(0);
    };

    init();
  }, []);

  return (
    <div ref={connect} className={cn('w-fit h-fit', className, classNames)}>
      <div
        ref={parentRef}
        className="List"
        style={{
          ...style,
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
                className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
              >
                <EntityProvider
                  index={virtualRow.index}
                  selection={ds}
                  current={currentDs?.id}
                  iterator={iterator}
                >
                  <Element
                    id="carousel"
                    className="h-full w-full "
                    role="carousel-header"
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

export default Virtualizer;
