import {
  ApplicationCommandData,
  ApplicationCommandOptionData,
} from "discord.js";

// Unused/Unimplemented commands
const testCommands: ApplicationCommandOptionData[] = [
  {
    type: 1,
    name: "search_faq",
    description: "EXPERIMENT: Search questions",
    options: [
      {
        type: 3,
        name: "term",
        description: "The term to search for",
        autocomplete: true,
      },
    ],
  },
  {
    type: 1,
    name: "whyh2test",
    description: "List the reasons to use h2testw",
  },
  {
    type: 1,
    name: "testattach",
    description: "attachment param testing",
    options: [
      {
        type: 11,
        name: "attachment",
        description: "ATTACH TO ME",
        required: true,
      },
    ],
  },
];

const botCommands: ApplicationCommandOptionData[] = [
  {
    type: 1,
    name: "pull",
    description: "Run Git Pull (1)",
  },
  {
    type: 1,
    name: "build",
    description: "Build Bot (2)",
  },
  {
    type: 1,
    name: "kill",
    description: "Kill Bot (3)",
  },
];

const ticketCommands: ApplicationCommandOptionData[] = [
  {
    type: 1,
    name: "create",
    description: "Open a thread to get you support",
    options: [
      {
        type: 3,
        name: "topic",
        description: "Short description (1-90) characters",
        required: true,
      },
      {
        type: 5,
        name: "private",
        description: "Ticket where only staff may reply",
      },
    ],
  },
  {
    type: 1,
    name: "staff_create",
    description: "Staff: Open ticket on behalf of another user",
    options: [
      {
        type: 6,
        name: "user",
        description: "User to open ticket for",
        required: true,
      },
      {
        type: 5,
        name: "private",
        description: "Ticket where only staff may reply",
      },
    ],
  },
  {
    type: 1,
    name: "setup",
    description: "Setup message to open a ticket",
  },
  {
    type: 1,
    name: "prompt",
    description: "Give prompt to close a ticket",
    options: [
      {
        type: 6,
        name: "user",
        description: "User to prompt",
        required: true,
      },
      {
        type: "STRING",
        name: "message",
        description: "The text to put after Hey {user},",
        required: false,
      },
    ],
  },
  {
    type: 1,
    name: "close",
    description: "Close a ticket",
    options: [
      {
        type: 6,
        name: "user",
        description: "(Staff only) User to close ticket for",
        required: false,
      },
    ],
  },
];

const memeCommands: ApplicationCommandOptionData[] = [
  {
    type: 1,
    name: "eta",
    description: "eta plz",
  },
  {
    type: 1,
    name: "shrek",
    description: "SHOW THE SHREK",
  },
];

const modCommands: ApplicationCommandOptionData[] = [
  {
    type: 1,
    name: "warn",
    description: "Issue a warning to a user",
    options: [
      {
        type: 6,
        name: "user",
        description: "User to issue warning to",
        required: true,
      },
      {
        type: 3,
        name: "reason",
        description: "Reason for issuing warning (Sent to user)",
        required: true,
      },
    ],
  },
  {
    type: 1,
    name: "deletewarn",
    description: "Delete warn from a user's log",
    options: [
      {
        type: 6,
        name: "user",
        description: "User",
        required: true,
      },
      {
        type: "NUMBER",
        name: "warn_number",
        description: "Warn number",
        required: true,
      },
    ],
  },
  {
    type: 1,
    name: "log",
    description: "Infractions/Notes the user has (if any)",
    options: [
      {
        type: 6,
        name: "user",
        description: "User to view",
        required: true,
      },
    ],
  },
  {
    type: 1,
    name: "note",
    description: "Issue a note to a user",
    options: [
      {
        type: 6,
        name: "user",
        description: "User to issue a note to",
        required: true,
      },
      {
        type: 3,
        name: "text",
        description: "The note",
        required: true,
      },
    ],
  },
  {
    type: 1,
    name: "info",
    description: "View info about a user",
    options: [
      {
        type: 6,
        name: "user",
        description: "User to view info about",
        required: true,
      },
    ],
  },
  {
    type: 1,
    name: "kick",
    description: "Kick a user from the server",
    options: [
      {
        type: 6,
        name: "user",
        description: "User",
        required: true,
      },
      {
        type: 3,
        name: "reason",
        description: "Reason (Sent to user)",
        required: true,
      },
    ],
  },
  {
    type: 1,
    name: "ban",
    description: "Ban a user from the server",
    options: [
      {
        type: 6,
        name: "user",
        description: "User",
        required: true,
      },
      {
        type: 3,
        name: "reason",
        description: "Reason (Sent to user)",
        required: true,
      },
    ],
  },
  {
    type: "SUB_COMMAND",
    name: "purge",
    description: "Purge messages",
    options: [
      {
        type: "NUMBER",
        name: "amount",
        description: "Amount to delete (1-99)",
        required: true,
      },
    ],
  },
  {
    type: 1,
    name: "review_me",
    description: "Have someone give you a review",
    options: [
      {
        type: 6,
        name: "user",
        description: "User who you want a review from",
        required: true,
      },
      {
        type: 3,
        name: "reason",
        description: "Reason for asking for a review (Be descriptive)",
        required: true,
      },
    ],
  },
];

const switchCommands: ApplicationCommandOptionData[] = [
  {
    type: 1,
    name: "reinstall",
    description: "Guide to manually (re)install DeepSea",
  },
  {
    type: 1,
    name: "dns",
    description: "View information about DNS servers you can use.",
  },
  {
    type: 1,
    name: "exfat",
    description:
      "Displays info on why not to use exfat and how to switch to FAT32.",
  },
  {
    type: 1,
    name: "guide",
    description: "Displays some useful guides",
  },
  {
    type: 1,
    name: "nag",
    description: "Shows helpful stuff about nags",
    options: [
      {
        type: 3,
        name: "type",
        description: "Type of possible fix",
        required: true,
        choices: [
          {
            name: "Goldleaf",
            value: "gl",
          },
          {
            name: "Maintenance Mode",
            value: "mm",
          },
        ],
      },
    ],
  },
  {
    type: 1,
    name: "patches",
    description: "Display info about patches",
  },
  {
    type: 1,
    name: "banlist",
    description: "View list of possible ban reasons",
  },
  {
    type: 1,
    name: "nogc",
    description: "Fix issues with gamecard reader",
  },
  {
    type: 1,
    name: "sd",
    description:
      "Displays info about making sure the SD card layout is correct",
    options: [
      {
        type: 3,
        name: "os",
        description:
          "Which OS to show the correct SD layout in (Default Windows 10)",
        required: false,
        choices: [
          {
            name: "Windows",
            value: "win",
          },
          {
            name: "macOS",
            value: "macos",
          },
        ],
      },
    ],
  },
  {
    type: 1,
    name: "deepsea",
    description: "View the latest deepsea version",
  },
  {
    type: 1,
    name: "cpr",
    description: "View info about CommonProblemResolver",
    options: [
      {
        type: 6,
        name: "target",
        description: "Who this is intended for",
      },
    ],
  },
  {
    type: 1,
    name: "hekatesdmount",
    description: "Guide to access Hekate's UMS feature.",
  },
];

const utilityCommands: ApplicationCommandOptionData[] = [
  {
    type: 1,
    name: "avatar",
    description: "Get someones avatar image",
    options: [
      {
        type: 6,
        name: "user",
        description: "User to get avatar from",
      },
      {
        type: 3,
        name: "size",
        description: "Requested size you want the image to be.",
        choices: [
          {
            name: "16px x 16px",
            value: "16",
          },
          {
            name: "32px x 32px",
            value: "32",
          },
          {
            name: "64px x 64px",
            value: "64",
          },
          {
            name: "128px x 128px",
            value: "128",
          },
          {
            name: "256px x 256px",
            value: "256",
          },
          {
            name: "512px x 512px",
            value: "512",
          },
        ],
      },
      {
        type: 5,
        name: "gif",
        description: "(If the avatar is a gif) Whether to send avatar as gif.",
      },
    ],
  },
  {
    type: 1,
    name: "lmgtfy",
    description: "Sends a link",
    options: [
      {
        type: 3,
        name: "search_term",
        description: "The search term of the link",
        required: true,
      },
      {
        type: 6,
        name: "target",
        description: "Who the link is intended for",
      },
    ],
  },
  {
    type: 1,
    name: "rule",
    description: "View a specific rule from #rules",
    options: [
      {
        type: 4,
        name: "number",
        description: "The rule number to view",
        required: true,
        choices: [
          {
            name: "Rule 1 - Be nice to other people",
            value: 1,
          },
          {
            name: "Rule 2 - No self promoting.",
            value: 2,
          },
          {
            name: "Rule 3 - No Piracy",
            value: 3,
          },
          {
            name: "Rule 4 - Don’t randomly ping people",
            value: 4,
          },
          {
            name: "Rule 5 - We loosely follow the Discord TOS",
            value: 5,
          },
          {
            name: "Rule 6 - No NSFW/L",
            value: 6,
          },
          {
            name: "Rule 7 - No Mini-Modding",
            value: 7,
          },
          {
            name: "Rule 8 - Chat in the correct channel",
            value: 8,
          },
        ],
      },
      {
        type: 6,
        name: "target",
        description: "Who this rule is directed to",
      },
    ],
  },
  {
    type: 1,
    name: "speak",
    description: "Send a message as the bot",
    options: [
      {
        type: 3,
        name: "text",
        description: "Message text",
        required: true,
      },
      {
        type: "BOOLEAN",
        name: "disable_ping",
        description: "Whether or not to have pings (allowed_mentions)",
        required: false,
      },
      {
        type: "BOOLEAN",
        name: "use_modal",
        description: "Use Modal to send text instead of provided text param",
        required: false,
      },
    ],
  },
];

const commands: ApplicationCommandData[] = [
  // CTX
  {
    type: "MESSAGE",
    name: "Quote Message",
    defaultPermission: true,
  },
  {
    type: "USER",
    name: "(Staff) Open Ticket",
    defaultPermission: true,
  },

  // Slash Commands
  {
    type: 1,
    name: "bot",
    description: "Commands related to running the bot",
    options: [...botCommands],
    defaultPermission: true,
  },
  {
    type: 1,
    name: "switch",
    description: "Commands related to the Nintendo Switch",
    options: [...switchCommands],
    defaultPermission: true,
  },
  {
    type: 1,
    name: "utility",
    description: "Commands related utility",
    options: [...utilityCommands],
    defaultPermission: true,
  },
  {
    type: 1,
    name: "tickets",
    description: "Commands related to tickets",
    options: [...ticketCommands],
    defaultPermission: true,
  },
  {
    type: 1,
    name: "mod",
    description: "Commands related to actions for server staff",
    options: [...modCommands],
    defaultPermission: true,
  },
  {
    type: 1,
    name: "meme",
    description: "Meme commands",
    options: [...memeCommands],
    defaultPermission: true,
  },
];

export default commands;
