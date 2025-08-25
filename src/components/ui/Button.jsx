// src/components/ui/Button.jsx
export function Button({ className = '', ...props }){
  return <button {...props} className={`btn ${className}`.trim()} />;
}
export function PrimaryButton(props){
  return <Button {...props} className={`primary ${props.className||''}`.trim()} />;
}
export function DangerButton(props){
  return <Button {...props} className={`danger ${props.className||''}`.trim()} />;
}
export function SuccessButton(props){
  return <Button {...props} className={`success ${props.className||''}`.trim()} />;
}
