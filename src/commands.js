export const DONOR_COMMAND = {
    name: 'donor',
    description: 'Claim your donor role using your donation email or transaction ID',
    options: [{
        name: 'code',
        type: 3,
        description: 'Foxycart transaction ID / email or Paypal email',
        required: true
    }]
}