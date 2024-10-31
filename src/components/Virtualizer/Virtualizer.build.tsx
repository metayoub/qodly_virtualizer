import {
  selectResolver,
  useDatasourceSub,
  useEnhancedEditor,
  useEnhancedNode,
  IteratorProvider,
} from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useCallback, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { IVirtualizerProps } from './Virtualizer.config';
import { Element } from '@ws-ui/craftjs-core';
import { MdInfoOutline } from 'react-icons/md';
import set from 'lodash/set';

const Virtualizer: FC<IVirtualizerProps> = ({
  orientation = 'vertical',
  datasource,
  style,
  className,
  classNames = [],
}) => {
  const {
    linkedNodes,
    actions: { setProp },
    connectors: { connect },
  } = useEnhancedNode((node) => ({
    linkedNodes: node.data.linkedNodes,
    dom: node.dom,
  }));
  const { resolver, query } = useEnhancedEditor(selectResolver);

  useDatasourceSub();
  const container = linkedNodes.element ? query.node(linkedNodes.element).get() : null;

  useEffect(() => {
    if (orientation !== 'grid' || !container) return;
    setProp((props: IVirtualizerProps) => {
      set(props, 'styleboxWidth', container?.data.props?.style?.width);
    });
  }, [
    orientation,
    classNames,
    style?.width,
    style?.height,
    container?.dom,
    container?.data.props?.style?.width,
    container?.data.props?.style?.height,
    container?.data.nodes.length,
  ]);

  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    horizontal: orientation === 'horizontal',
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (orientation === 'horizontal' ? 100 : 45),
    overscan: 5,
  });

  const items = virtualizer.getVirtualItems();

  const VirtualizerView = useCallback(
    ({ orientation }: IVirtualizerProps) => {
      const isHorizontal = orientation === 'horizontal';
      const isVertical = orientation === 'vertical';
      const isGrid = orientation === 'grid';

      return (
        <div
          ref={parentRef}
          id="virtualizer-list"
          className="virtualizer-list"
          style={{
            height: '100%',
            width: '100%',
            overflowY: isHorizontal || isGrid ? 'auto' : 'hidden',
            overflowX: isVertical ? 'auto' : 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: isHorizontal || isGrid ? '100%' : 'auto',
              width: isVertical || isGrid ? '100%' : 'auto',
              position: 'relative',
              transform: isHorizontal
                ? `translateX(${items[0]?.start ?? 0}px)`
                : isVertical
                  ? `translateY(${items[0]?.start ?? 0}px)`
                  : 'none',
            }}
          >
            {items.map((virtualRow) => (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                className={`virtualizer-item h-full ${virtualRow.index % 2 === 0 ? 'virtualizer-item-odd' : 'virtualizer-item-even'}`}
                style={{
                  position: 'relative',
                  height: isGrid || isHorizontal ? '100%' : 'auto',
                }}
              >
                {virtualRow.index === 0 ? (
                  <IteratorProvider>
                    <Element
                      id="element"
                      style={{
                        width: isHorizontal ? 'fit-content' : isGrid ? '200px' : '100%',
                        height: isVertical ? 'fit-content' : isGrid ? '200px' : '100%',
                        minWidth: isHorizontal ? '150px' : 'auto',
                        minHeight: isVertical ? '100px' : 'auto',
                      }}
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
      );
    },
    [items],
  );

  const EmptyState = () => (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border bg-purple-400 py-4 text-white">
      <MdInfoOutline className="mb-1 h-8 w-8" />
      <p>Please attach a Qodly Source</p>
    </div>
  );

  return (
    <div
      ref={connect}
      style={style}
      id="virtualizer"
      className={cn('virtualizer w-fit h-fit border border-gray-300', className, classNames)}
    >
      {datasource ? <VirtualizerView orientation={orientation} /> : <EmptyState />}
    </div>
  );
};

export default Virtualizer;
