import {
  selectResolver,
  useEnhancedEditor,
  useEnhancedNode,
  useRenderer,
  useSources,
  EntityProvider,
  useDataLoader,
  useDsChangeHandler,
  entitySubject,
  EntityActions,
} from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { IVirtualizerProps } from './Virtualizer.config';
import { Element } from '@ws-ui/craftjs-core';

const Virtualizer: FC<IVirtualizerProps> = ({ iterator, style, className, classNames = [] }) => {
  const { connect, emit } = useRenderer();
  const { id: nodeID } = useEnhancedNode();
  const parentRef = useRef(null);
  const [selected, setSelected] = useState(-1);
  const [_scrollIndex, setScrollIndex] = useState(0);
  const [count, setCount] = useState(0);
  const {
    sources: { datasource: ds, currentElement: currentDs },
  } = useSources();
  const { fetchIndex } = useDataLoader({
    source: ds,
  });

  const { resolver } = useEnhancedEditor(selectResolver);

  const virtualizer = useVirtualizer({
    count: count,
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
      setCount(selLength);
      await fetchIndex(0);
    };

    init();
  }, []);

  const { updateCurrentDsValue } = useDsChangeHandler({
    source: ds,
    currentDs,
    selected,
    setSelected,
    setScrollIndex,
    setCount,
    fetchIndex,
    onDsChange: (length, selected) => {
      if (selected >= 0) {
        updateCurrentDsValue({
          index: selected < length ? selected : 0,
          forceUpdate: true,
        });
      }
    },
    onCurrentDsChange: (selected) => {
      entitySubject.next({
        action: EntityActions.UPDATE,
        payload: {
          nodeID,
          index: selected,
        },
      });
    },
  });

  const handleClick = async (index: number) => {
    setSelected(index);
    await updateCurrentDsValue({ index });
    emit!('onselect');
  };

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
                className={cn({
                  selected: virtualRow.index === selected,
                  'bg-purple-200': virtualRow.index === selected,
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
