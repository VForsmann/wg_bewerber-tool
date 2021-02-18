import { customElement, html, LitElement, query } from "lit-element";
import { PageMixin } from "../../client-packages/page-mixin/page.mixin";
import { router } from "../../client-packages/router/router";

import './web-root.scss';

@customElement('web-root')
export default class WebRoot extends PageMixin(LitElement) {

    @query('#filter')
    multiSelect!: any;

    render() {
        return html`${this.renderOutlet()}`
    }

    firstUpdated() {
        router.subscribe(() => this.requestUpdate());
    }

    renderOutlet() {
        switch(router.getPath()) {
            case "add-applicant":
                return html`<add-applicant></add-applicant>`;
            case "applicant":
                return html`<single-applicant></single-applicant>`
            default:
                return html`<applicant-list></applicant-list>`
        }
    }
}