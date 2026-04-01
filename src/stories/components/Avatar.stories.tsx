import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
  },
  args: {
    size: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithFallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>MR</AvatarFallback>
    </Avatar>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="default">
        <AvatarFallback>MR</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>AL</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarFallback>MR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>GC</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+5</AvatarGroupCount>
    </AvatarGroup>
  ),
};

export const WithImage: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=M" alt="M" />
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=MR" alt="MR" />
        <AvatarFallback>MR</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=SymposiumAI" alt="AF" />
        <AvatarFallback>FL</AvatarFallback>
      </Avatar>
    </div>
  ),
};
