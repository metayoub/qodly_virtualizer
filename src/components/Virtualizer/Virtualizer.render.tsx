import {
  selectResolver,
  useEnhancedEditor,
  useEnhancedNode,
  useRenderer,
  useSources,
  useDataLoader,
  useDsChangeHandler,
  entitySubject,
  EntityActions,
} from '@ws-ui/webform-editor';
import { FC, useEffect, useRef, useState } from 'react';
import { IVirtualizerProps } from './Virtualizer.config';
import VerticalVirtualizer from './VerticalVirtualizer';
import HorizontalVirtualizer from './HorizontalVirtualizer';
import GridVirtualizer from './GridVirtualizer';

const Virtualizer: FC<IVirtualizerProps> = ({
  orientation = 'vertical',
  iterator,
  style,
  className,
  classNames = [],
}) => {
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

  switch (orientation) {
    case 'vertical':
      return (
        <VerticalVirtualizer
          connect={connect}
          iterator={iterator}
          style={style}
          className={className}
          classNames={classNames}
          selected={selected}
          ds={ds}
          currentDs={currentDs}
          parentRef={parentRef}
          count={count}
          handleClick={handleClick}
          resolver={resolver}
        />
      );

    case 'horizontal':
      return (
        <HorizontalVirtualizer
          connect={connect}
          iterator={iterator}
          style={style}
          className={className}
          classNames={classNames}
          selected={selected}
          ds={ds}
          currentDs={currentDs}
          parentRef={parentRef}
          count={count}
          handleClick={handleClick}
          resolver={resolver}
        />
      );

    case 'grid':
      return (
        <GridVirtualizer
          connect={connect}
          iterator={iterator}
          style={style}
          className={className}
          classNames={classNames}
          selected={selected}
          ds={ds}
          currentDs={currentDs}
          parentRef={parentRef}
          count={count}
          handleClick={handleClick}
          resolver={resolver}
        />
      );

    default:
      return null;
  }
};

export default Virtualizer;
