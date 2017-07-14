const ipv4Segment = `(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])`;
const ipv4Address = `(?:${ipv4Segment}\\.){3}${ipv4Segment}`;
const ipv6Segment = `[0-9a-f]{1,4}`;
const ipv6Address = `((${ipv6Segment}:){7,7}${ipv6Segment}|(${ipv6Segment}:){1,7}:|(${ipv6Segment}:){1,6}:${ipv6Segment}|(${ipv6Segment}:){1,5}(:${ipv6Segment}){1,2}|(${ipv6Segment}:){1,4}(:${ipv6Segment}){1,3}|(${ipv6Segment}:){1,3}(:${ipv6Segment}){1,4}|(${ipv6Segment}:){1,2}(:${ipv6Segment}){1,5}|${ipv6Segment}:((:${ipv6Segment}){1,6})|:((:${ipv6Segment}){1,7}|:))`;
const cidrSubnet32 = `(?:(3[0-2]|[1-2][0-9]|[0-9]))`;
const cidrSubnet128 = `(?:(3[0-2]|[1-2][0-9]|[0-9]))`;

const v4 = {
  IP: new RegExp(`^${ipv4Address}$`),
  CIDR: new RegExp(`^${ipv4Address}\\/${cidrSubnet32}$`),
  range: new RegExp(`^${ipv4Address}-${ipv4Address}$`),
};

const v6 = {
  IP: new RegExp(`^${ipv6Address}$`),
  CIDR: new RegExp(`^${ipv6Address}\\/${cidrSubnet128}$`),
  range: new RegExp(`^${ipv6Address}-${ipv6Address}$`),
};

export { v4, v6 };
