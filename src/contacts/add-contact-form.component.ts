declare var System: any;

const template = document.createElement("template");

const promises = Promise.all([
    System.import("./add-contact-form.component.html"),
    System.import("./add-contact-form.component.css")
]);

export const ADD_CONTACT_FORM_SUBMITTED = "[AddContactForm] ADD_CONTACT_FORM_SUBMITTED";

export interface Contact {
    firstname: string;
    lastname: string;    
    streetAddress: string;
    city: string;
    email: string;
    phoneNumber: string;
}

export class AddContactFormSubmitted extends CustomEvent {
    constructor(contact:Contact) {
        super(ADD_CONTACT_FORM_SUBMITTED, {
            cancelable: true,
            bubbles: true,
            composed: true,
            detail: { contact }
        } as CustomEventInit);
    }
}

export class AddContactFormComponent extends HTMLElement {
    constructor() {
        super();
    }

    public email: string;

    public firstname: string;

    public lastname: string;

    public phoneNumber: string;

    public streetAddress: string;

    public city: string;

    public buttonCaption: any = "Submit";

    public get emailHTMLElement(): HTMLInputElement { return this.shadowRoot.querySelector(".email") as HTMLInputElement; }

    public get firstnameHTMLElement(): HTMLInputElement { return this.shadowRoot.querySelector(".firstname") as HTMLInputElement; }

    public get lastnameHTMLElement(): HTMLInputElement { return this.shadowRoot.querySelector(".lastname") as HTMLInputElement; }

    public get phoneHTMLElement(): HTMLInputElement { return this.shadowRoot.querySelector(".phone-number") as HTMLInputElement; }

    public get streeAddressHTMLElement(): HTMLInputElement { return this.shadowRoot.querySelector(".street-address") as HTMLInputElement; }

    public get cityHTMLElement(): HTMLInputElement { return this.shadowRoot.querySelector(".city") as HTMLInputElement; }

    public get buttonHTMLElement(): HTMLButtonElement { return this.shadowRoot.querySelector("button") as HTMLButtonElement; }

    public dispatchAddContactFormSubmittedEvent() {
        this.dispatchEvent(new AddContactFormSubmitted({
            email: this.emailHTMLElement.value,
            firstname: this.firstnameHTMLElement.value,
            lastname: this.lastnameHTMLElement.value,
            streetAddress: this.streeAddressHTMLElement.value,
            city: this.cityHTMLElement.value,
            phoneNumber: this.phoneHTMLElement.value
        }));
    }
    
    async connectedCallback() {
        const assests = await promises;
        template.innerHTML = `<style>${assests[1]}</style>${assests[0]}`; 
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));  
        this._setEventListeners();
    }
    
    private _setEventListeners() {
        this.buttonHTMLElement.addEventListener("click", this.dispatchAddContactFormSubmittedEvent);
    }

    disconnectedCallback() {
        this.buttonHTMLElement.removeEventListener("click", this.dispatchAddContactFormSubmittedEvent);
    }    
}

customElements.define(`ce-add-contact-form`,AddContactFormComponent);