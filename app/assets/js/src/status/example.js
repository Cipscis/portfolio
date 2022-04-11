import { status } from './status.js';
import { activate } from '@cipscis/activate';

activate('.js-status-example-success', () => status.success('Success :)'));
activate('.js-status-example-error', () => status.error('Error :('));
activate('.js-status-example-hide', () => status.hide());

activate('.js-status-example-custom', () => status.success('Custom success :)', '.js-status-custom'));
activate('.js-status-example-custom-hide', () => status.hide('.js-status-custom'));

activate('.js-status-example-autohide', () => status.success('This message will hide in 10 seconds', null, 10000));
