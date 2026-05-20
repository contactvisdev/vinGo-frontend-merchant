import React from "react";
import { Dialog } from "primereact/dialog";

export default function BaseModal({
  visible,
  onHide,
  title,
  children,
  footer = null,
  width = "40rem",
  closable = true,
  dismissableMask = true,
  contentClassName = "",
}) {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={title}
      footer={footer}
      closable={closable}
      dismissableMask={dismissableMask}
      style={{ width }}
      pt={{ content: { className: contentClassName } }}
      modal
      blockScroll
      draggable={false}
      resizable={false}
    >
      {children}
    </Dialog>
  );
}
