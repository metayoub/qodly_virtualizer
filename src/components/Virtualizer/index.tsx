import config, { IVirtualizerProps } from './Virtualizer.config';
import { T4DComponent, useEnhancedEditor } from '@ws-ui/webform-editor';
import Build from './Virtualizer.build';
import Render from './Virtualizer.render';

const Virtualizer: T4DComponent<IVirtualizerProps> = (props) => {
  const { enabled } = useEnhancedEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return enabled ? <Build {...props} /> : <Render {...props} />;
};

Virtualizer.craft = config.craft;
Virtualizer.info = config.info;
Virtualizer.defaultProps = config.defaultProps;

export default Virtualizer;
