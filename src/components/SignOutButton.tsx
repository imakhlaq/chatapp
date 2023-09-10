import { ButtonHTMLAttributes, useState } from "react";
import Button from "@/components/ui/Button";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {};
export default function SignOutButton({ ...props }: Props) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <Button
      {...props}
      isLoading={false}
      variant="ghost"
      onClick={async () => {
        setIsSigningOut(true);
        try {
          await signOut();
        } catch (e) {
          toast.error("There was a problem signing out");
        } finally {
          setIsSigningOut(true);
        }
      }}
    >
      {isSigningOut ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
    </Button>
  );
}
