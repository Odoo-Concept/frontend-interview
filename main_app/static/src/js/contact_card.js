/** @odoo-module **/
import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";

class ContactCard extends Component {
    static template = "custom_contact_card.ContactCard";
    static props = ["contact"];

    setup() {
        console.log("Componente ContactCard montado");
        this.state = useState({
            currentStatus: this.props.contact.data.availability_status || "online"
        });

        this.statusClasses = {
            online: "status-online",
            busy: "status-busy",
            away: "status-away"
        };

        this.orm = useService("orm");
        this.action = useService("action");
    }

    getInitials() {
        const name = this.props.contact.data.name || '';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    }

    async changeStatus(newStatus) {
        this.state.currentStatus = newStatus;
        if (this.props.contact.resId) {
            await this.orm.write("res.partner", [this.props.contact.resId], {
                availability_status: newStatus
            });
        }
    }

    handleAction(action) {
        if (!this.props.contact.resId) return;

        switch(action) {
            case 'call':
                const phone = this.props.contact.data.phone;
                if (phone) window.location.href = `tel:${phone}`;
                break;
            case 'email':
                this.action.doAction({
                    type: 'ir.actions.act_window',
                    res_model: 'mail.compose.message',
                    views: [[false, 'form']],
                    context: {
                        'default_res_id': this.props.contact.resId,
                        'default_model': 'res.partner',
                        'default_composition_mode': 'comment',
                    },
                });
                break;
            case 'message':
                this.env.services['mail.chat'].openChat({
                    partnerId: this.props.contact.resId,
                });
                break;
        }
    }
}

registry.category("public_components").add("custom_contact_card.ContactCard", ContactCard);
