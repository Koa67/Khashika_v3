import { redirect } from 'next/navigation';

// Redirect /boutique to /shop for consistency
export default function BoutiquePage() {
  redirect('/shop');
}





