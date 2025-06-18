# models/res_partner.py
from odoo import models, fields


class ResPartner(models.Model):
    _inherit = 'res.partner'

    availability_status = fields.Selection(
        [('online', 'Online'),
         ('busy', 'Busy'),
         ('away', 'Away')],
        string='Availability Status',
        default='online'
    )
