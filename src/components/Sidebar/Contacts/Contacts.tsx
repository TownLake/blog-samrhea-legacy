import React from "react";

import { atob } from "abab";

import { Icon } from "@/components/Icon";
import { ICONS } from "@/constants";
import { Dictionary } from "@/types";
import { getContactHref, getIcon } from "@/utils";

import * as styles from "./Contacts.module.scss";

type Props = {
  contacts: Dictionary<string>;
};

const Contacts: React.FC<Props> = ({ contacts }: Props) => {
  const contactsEntered: Dictionary<string> = Object.keys(contacts).reduce(
    (acc, key) =>
      contacts[key] && contacts[key] !== "" && contacts[key] !== "#"
        ? { ...acc, [key]: contacts[key] }
        : acc,
    {},
  );

  return (
    Object.keys(contactsEntered).length > 0 && (
      <div className={styles.contacts}>
        <ul className={styles.list}>
          {(Object.keys(contactsEntered) as Array<keyof typeof ICONS>).map(
            (name) => (
              <li className={styles.item} key={name}>
                {name === "email" ? (
                  <span
                    className={styles.link}
                    onClick={() => {
                      window.location.href =
                        "mailto:" +
                        atob(getContactHref(name, contactsEntered[name]));
                    }}
                  >
                    <Icon name={name} icon={getIcon(name)} />
                  </span>
                ) : (
                  <a
                    className={styles.link}
                    href={getContactHref(name, contactsEntered[name])}
                    target="_blank"
                    rel={`noopener noreferrer${
                      name === "mastodon" ? " me" : ""
                    }`}
                  >
                    <Icon name={name} icon={getIcon(name)} />
                  </a>
                )}
              </li>
            ),
          )}
        </ul>
      </div>
    )
  );
};

export default Contacts;
