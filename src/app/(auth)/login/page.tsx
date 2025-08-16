import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquareText } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md border-none shadow-lg">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
           <div className="bg-primary text-primary-foreground rounded-full p-3">
             <MessageSquareText className="h-8 w-8" />
           </div>
        </div>
        <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required className="py-6" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required className="py-6" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Link href="/" className="w-full">
            <Button className="w-full py-6 text-lg">Sign in</Button>
        </Link>
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline hover:text-primary">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}