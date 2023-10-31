import { Icons } from "../Icons"
import UserAuthForm from "./UserAuthForm"

const SignIn = ({}) => {
  return (
    <div className="conatiner mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        {/* Logo */}
        <Icons.Logo className="h-14 w-auto text-indigo-600" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up a Talkative account and agree to our User Agreement and Privacy Policy
        </p>

        {/* Sign-in form  */}
        <UserAuthForm />
      </div>
    </div>
  )
}

export default SignIn