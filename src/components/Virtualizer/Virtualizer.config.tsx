import { EComponentKind, T4DComponentConfig } from '@ws-ui/webform-editor';
import { Settings } from '@ws-ui/webform-editor';
import { MdViewDay } from 'react-icons/md';

import VirtualizerSettings, { BasicSettings } from './Virtualizer.settings';

export default {
  craft: {
    displayName: 'Virtualizer',
    kind: EComponentKind.BASIC,
    props: {
      name: '',
      classNames: [],
      events: [],
    },
    related: {
      settings: Settings(VirtualizerSettings, BasicSettings),
    },
  },
  info: {
    settings: VirtualizerSettings,
    displayName: 'Virtualizer',
    exposed: true,
    icon: MdViewDay,
    sanityCheck: {
      keys: [
        { name: 'datasource', require: true, isDatasource: true },
        { name: 'currentElement', require: false, isDatasource: true },
      ],
    },
    requiredFields: {
      keys: ['datasource'],
      all: false,
    },
    events: [
      {
        label: 'On Click',
        value: 'onclick',
      },
      {
        label: 'On Select',
        value: 'onselect',
      },
      {
        label: 'On MouseEnter',
        value: 'onmouseenter',
      },
      {
        label: 'On MouseLeave',
        value: 'onmouseleave',
      },
      {
        label: 'On KeyDown',
        value: 'onkeydown',
      },
      {
        label: 'On KeyUp',
        value: 'onkeyup',
      },
    ],
    datasources: {
      declarations: [{ key: 'datasource', iterable: true }, { key: 'currentElement' }],
    },
  },
  defaultProps: {
    name: 'Qodly',
    iterable: true,
    style: {
      height: `200px`,
      width: `400px`,
    },
  },
} as T4DComponentConfig<IVirtualizerProps>;

export interface IVirtualizerProps extends webforms.ComponentProps {
  name?: string;
}
