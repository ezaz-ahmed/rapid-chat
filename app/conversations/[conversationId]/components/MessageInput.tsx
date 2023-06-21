'use client';

import { ComponentProps, FC } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface MessageInputProps extends ComponentProps<'input'> {
  id: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const MessageInput: FC<MessageInputProps> = ({
  id,
  register,
  errors,
  required,
  ...restPorps
}) => {
  return (
    <div className=' relative w-full'>
      <input
        className=' text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full outline-none'
        id={id}
        autoComplete={id}
        {...register(id, { required })}
        {...restPorps}
      />
    </div>
  );
};

export default MessageInput;
