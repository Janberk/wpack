/**
 * Application entry point module loading dependent modules.
 */
import '@babel/polyfill';
import './assets/favicon.png';
import './styles/materialize.min.css';
import './styles/material-font-icons.css';
import './styles/main.css';
import './js/materialize.min.js';
import SevdeskClient from './modules/sevdesk-client';

const client = new SevdeskClient();
