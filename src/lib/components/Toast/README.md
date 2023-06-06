# Toast

This toast component supports two variations. \
    - SUCCESS TOAST
    - ERROR TOAST
    
Both these variations can be  invoked with `updateToastQueue` method of toast store

## SUCCESS TOAST

```
import { toastStore } from '$lib/stores/ToastStore';

toastStore.updateToastQueue({
	type: 'SUCCESS',
	message: 'Mutual Fund added to cart',
	redirectText: 'VIEW CART',
	redirectLink: `/cart`
});
```
Success Toast have two optional parameters - `redirectText` and `redirectLink`. Having these two parameters in the toast object will render a CTA clicking which will navigate to the redirect link.

## ERROR TOAST
```
import { toastStore } from '$lib/stores/ToastStore';

toastStore.updateToastQueue({
	type: 'ERROR',
	message: 'Mutual Fund could not be added to cart due to technical error'
});
```

