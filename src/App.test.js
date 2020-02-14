import React from "react";
import {fireEvent, render, waitForElement, waitForElementToBeRemoved} from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import App from "./App";
import ContactForm from "./components/ContactForm";

test("renders App without crashing", () => {
  render(<App />);
});

test("form works properly", async () => {
  const {getByTestId, getByLabelText} = render(<ContactForm />);

  const firstNameInput = getByTestId("firstName");
  const firstNameCB = () => getByTestId("firstNameError");

  fireEvent.blur(firstNameInput);
  await waitForElement(firstNameCB);

  fireEvent.change(firstNameInput, {target: {value: 'toolong'}});
  fireEvent.blur(firstNameInput);
  await waitForElement(firstNameCB);

  fireEvent.change(firstNameInput, {target: {value: 'aaa'}});
  fireEvent.blur(firstNameInput);
  await waitForElementToBeRemoved(firstNameCB);

  const lastNameInput = getByTestId("lastName");
  const lastNameCB = () => getByTestId("lastNameError");

  fireEvent.blur(lastNameInput);
  await waitForElement(lastNameCB);

  fireEvent.change(lastNameInput, {target: {value: 'last name text'}});
  fireEvent.blur(lastNameInput);
  await waitForElementToBeRemoved(lastNameCB);

  const emailInput = getByTestId("email");
  const emailCB = () => getByTestId("emailError");

  fireEvent.blur(emailInput);
  await waitForElement(emailCB);

  fireEvent.change(emailInput, {target: {value: 'email text'}});
  fireEvent.blur(emailInput);
  await waitForElementToBeRemoved(emailCB);

  const messageInput = getByTestId("message");
  fireEvent.change(messageInput, {target: {value: 'message text'}});
  fireEvent.click(getByTestId("submit"));

  const res = await waitForElement(() => getByTestId("results"));
  expect(res).toBeInTheDocument();
  expect(res).toBeTruthy();
  expect(res).toBeVisible();
  expect(res).toHaveTextContent("aaa");
  expect(res).toHaveTextContent("last name text");
  expect(res).toHaveTextContent("email text");
  expect(res).toHaveTextContent("message text");
});
