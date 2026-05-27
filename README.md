# warriorswithhearts.github.io

## Temporary donation raffle feature

The site currently includes a temporary donation raffle experience:

- a raffle call-to-action in the hero section
- a raffle spotlight section on the home page
- a popup modal that shows:
  - raffle results status
  - the raffle flyer image
  - readable raffle details
  - searchable ticket assignments

### Turning the raffle feature off

The entire raffle feature is controlled by one flag in:

- `js/script.js`

To hide all raffle-related UI, change:

```js
const RAFFLE_FEATURE_ENABLED = true;
```

to:

```js
const RAFFLE_FEATURE_ENABLED = false;
```

When disabled, the hero raffle button and raffle spotlight section remain hidden, and the raffle modal cannot be opened.

### Updating raffle ticket assignments

Public raffle assignments are loaded from:

- `data/raffle-ticket-assignments.csv`

The public CSV should contain only:

```csv
ticket_number,purchaser_name
```

Use this template when preparing updates:

- `data/raffle-ticket-assignments.template.csv`

Example:

```csv
ticket_number,purchaser_name
001,Example Buyer
002,"Second Example Buyer, Jr."
```

Visitors do **not** see the full buyer list automatically. In the raffle modal, they must begin typing a purchaser name, and matching ticket assignments appear as they type.

For each biweekly update:

1. Replace the contents of `data/raffle-ticket-assignments.csv` with the latest reconciled CSV.
2. Keep the same two-column header:
   - `ticket_number`
   - `purchaser_name`
3. Publish the updated site.
