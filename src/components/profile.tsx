'use client';

import { useSession } from 'next-auth/react';

export default function Profile() {
   const session = useSession();
   if (session.data?.user) {
      return <div>From Client Signed In</div>;
   }
   return <div>From Client is Not Signed In</div>;
}
