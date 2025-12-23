"use server"

import { SignInValues, SignUpValues } from "@/lib/schemas/auth.schema"
import { sendRequest } from "@/lib/helpers/api"
import { signIn } from "@/auth"

export const signUpAction = async (data: SignUpValues) => {
  const { fullName, email, confirmPassword } = data
  const res = await sendRequest<IBackendRes<IAuth>>({
    url: "/auth/signup",
    method: "POST",
    body: {
      fullName,
      email,
      password: confirmPassword,
    },
  })
  if (res.statusCode === 201) {
    await signIn("credentials", {
      email,
      password: confirmPassword,
      redirect: false,
    })
  } else {
    throw new Error(res.message)
  }
}

export const signInAction = async (data: SignInValues) => {
  const { email, password } = data
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    return {
      statusCode: 200,
      message: "Đăng nhập thành công!"
    }
  } catch (error: any) {
    return {
      statusCode: 401,
      message: "Tài Khoản hoặc mật khẩu không chính xác!",
    }
  }
}