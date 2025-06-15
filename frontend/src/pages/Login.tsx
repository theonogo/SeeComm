import LoginButton from '../components/LoginButton'

export default function Login() {
    return (
      <div className="absolute flex-col left-1/2 top-[40%] transform -translate-x-1/2 border border-border bg-popover rounded-lg p-4 shadow-md w-sm h-40 flex justify-center">
        <LoginButton />
      </div>
    )
}