"use client";

import { Alert } from "reactstrap";

interface SuccessAlertProps {
  message?: string;
}

export default function SuccessAlert({ message }: SuccessAlertProps) {
  if (!message) {
    return null;
  }

  return <Alert color="success">{message}</Alert>;
}
