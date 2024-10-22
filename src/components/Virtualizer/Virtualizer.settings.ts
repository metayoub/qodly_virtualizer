import { DEFAULT_ITERATOR, ESetting, ETextFieldModifier, TSetting } from '@ws-ui/webform-editor';
import { BASIC_SETTINGS, DEFAULT_SETTINGS, load } from '@ws-ui/webform-editor';
import { validateServerSide } from '@ws-ui/shared';
import { PiArrowsInLineHorizontal, PiArrowsInLineVertical, PiGridNineFill } from 'react-icons/pi';

const commonSettings: TSetting[] = [
  {
    label: 'Orientation',
    type: ESetting.RADIOGROUP,
    defaultValue: 'vertical',
    key: 'orientation',
    multiple: false,
    options: [
      {
        value: 'horizontal',
        tooltip: 'Horizontal',
        icon: PiArrowsInLineHorizontal,
      },
      {
        value: 'vertical',
        tooltip: 'Vertical',
        icon: PiArrowsInLineVertical,
      },
      {
        value: 'grid',
        tooltip: 'Grid',
        icon: PiGridNineFill,
      },
    ],
  },
];

const dataAccessSettings: TSetting[] = [
  {
    key: 'datasource',
    label: 'Qodly Source',
    type: ESetting.DS_AUTO_SUGGEST,
  },
  {
    key: 'currentElement',
    label: 'Selected Element',
    type: ESetting.DS_AUTO_SUGGEST,
  },
  {
    key: 'iterator',
    label: 'Iterate with',
    type: ESetting.TEXT_FIELD,
    modifier: ETextFieldModifier.ITERATOR,
    placeholder: DEFAULT_ITERATOR,
  },
  {
    key: 'serverSideRef',
    label: 'Server Side',
    type: ESetting.TEXT_FIELD,
    hasError: validateServerSide,
    validateOnEnter: true,
  },
];

const Settings: TSetting[] = [
  {
    key: 'properties',
    label: 'Properties',
    type: ESetting.GROUP,
    components: commonSettings,
  },
  {
    key: 'dataAccess',
    label: 'Data Access',
    type: ESetting.GROUP,
    components: dataAccessSettings,
    isStateless: true,
  },
  ...load(DEFAULT_SETTINGS).filter('dataAccess'),
];

export const BasicSettings: TSetting[] = [
  ...commonSettings,
  ...dataAccessSettings,
  ...load(BASIC_SETTINGS).filter('serverSideRef'),
];

export default Settings;
