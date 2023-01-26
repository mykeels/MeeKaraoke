/* eslint-disable react/no-unknown-property */
import "./index.css";

import classNames from "classnames/dedupe";
import PropTypes from "prop-types";
import React from "react";
import { assert } from "../../utils";

const constants = {
  RESPONSIVE_SIZES: [
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "6xl",
    "full",
    "max"
  ],
  SIZE_VALUES: {
    xs: 0,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    "2xl": 5,
    "3xl": 6,
    "4xl": 7,
    "5xl": 8,
    "6xl": 9,
    full: 10,
    max: 11
  }
} as const;

type ModalSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "full"
  | "max";
type ModalProps = {
  title?: string;
  isOpen: boolean;
  onClose?: () => any;
  size: ModalSize;
  children: any;
  className: any;
  ModalOverlay?: (props: { [key: string]: any }) => JSX.Element;
  ModalContainer?: (props: {
    [key: string]: any;
    children: any;
    size: string;
  }) => JSX.Element;
  ModalTitle?: (props: {
    [key: string]: any;
    children: any;
    size: string;
  }) => JSX.Element;
  ModalContent?: (props: { [key: string]: any; children: any }) => JSX.Element;
};

export const Modal = ({
  title,
  isOpen,
  onClose,
  size,
  children,
  className,
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  ModalContent
}: ModalProps) => {
  const modalClass = classNames(
    [
      "modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-30"
    ],
    {
      "opacity-0 pointer-events-none": !isOpen
    },
    className
  );
  return (
    <div className={modalClass}>
      {ModalOverlay ? <ModalOverlay /> : null}

      {ModalContainer ? (
        <ModalContainer size={size}>
          {title || onClose ? (
            ModalTitle ? (
              <ModalTitle size={size}>
                <>
                  <span>{title}</span>
                  {onClose ? (
                    <button onClick={onClose}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14.251"
                        height="14.251"
                        viewBox="0 0 14.251 14.251"
                      >
                        <rect
                          width="17.995"
                          height="2.159"
                          rx="1.08"
                          transform="translate(1.527) rotate(45)"
                          fill="currentColor"
                        />
                        <rect
                          data-name="Rectangle 146"
                          width="17.995"
                          height="2.159"
                          rx="1.08"
                          transform="translate(14.252 1.527) rotate(135)"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  ) : null}
                </>
              </ModalTitle>
            ) : null
          ) : null}
          {ModalContent ? <ModalContent>{children}</ModalContent> : null}
        </ModalContainer>
      ) : null}
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  size: PropTypes.oneOf(constants.RESPONSIVE_SIZES),
  children: PropTypes.element.isRequired,
  className: PropTypes.any,
  ModalOverlay: PropTypes.func,
  ModalContainer: PropTypes.func,
  ModalTitle: PropTypes.func,
  ModalContent: PropTypes.func
};

type ModalOverlayProps = { className?: any; children?: any };
export const ModalOverlay = ({ className, ...props }: ModalOverlayProps) => {
  const overlayClassName = classNames(
    "modal-overlay absolute w-full h-full bg-brown-200 opacity-80",
    className
  );
  return <div className={overlayClassName} {...props}></div>;
};

type ModalContainerProps = {
  className?: any;
  children?: any;
  size?: ModalSize;
  [key: string]: any;
};
export const ModalContainer = ({
  className,
  children,
  size,
  ...props
}: ModalContainerProps) => {
  const containerClassName = classNames(
    `modal-container bg-white w-11/12 mx-auto my-4 rounded shadow-lg z-50 max-h-full overflow-y-auto`,
    `md:max-w-${size || "md"}`,
    className
  );
  return (
    <div {...props} className={containerClassName}>
      {children}
    </div>
  );
};

type ModalTitleProps = {
  className?: any;
  children?: any;
  size?: ModalSize;
  [key: string]: any;
};
export const ModalTitle = ({
  className,
  children,
  size,
  ...props
}: ModalTitleProps) => {
  const titleClassName = classNames(
    [`bg-yellow flex justify-between items-center pl-6 pr-2 font-bold`],
    {
      "py-2 text-lg":
        constants.SIZE_VALUES[assert(size)] < constants.SIZE_VALUES["lg"],
      "py-4 text-2xl":
        constants.SIZE_VALUES[assert(size)] >= constants.SIZE_VALUES["lg"]
    },
    className
  );
  return (
    <div className={titleClassName} {...props}>
      {children}
    </div>
  );
};

type ModalContentProps = { className?: any, children?: any, size?: ModalSize, [key: string]: any }
export const ModalContent = ({ className, children, ...props }: ModalContentProps) => {
  const contentClassName = classNames(
    "modal-content py-4 text-left px-6 bg-white",
    className
  );
  return (
    <div className={contentClassName} {...props}>
      {children}
    </div>
  );
};

Modal.defaultProps = {
  ModalOverlay,
  ModalTitle,
  ModalContainer,
  ModalContent
};

Modal.displayName = "Modal";
