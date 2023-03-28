import {
  Accordion,
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Burger,
  Button,
  Card,
  Container,
  createStyles,
  Drawer,
  Group,
  Menu as AvatarMenu,
  Paper,
  Space,
  Text,
  Textarea,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
  LoadingOverlay,
} from '@mantine/core'
import { useMediaQuery, useWindowScroll } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { MdLanguage, MdLogout } from 'react-icons/md'
import Panel from './components/Panel'
import { MENU_HEIGHT, SIDEBAR_WIDTH_FULL, useConfigData } from './config'
import { useTranslation } from 'react-i18next'
import { BsMoonStars, BsSun } from 'react-icons/bs'
import { t } from 'utils/i18nextFix'
import { useStoreStateControl } from 'hooks/useStoreStateControle'

import { useFixedComponent } from 'contexts/fixedComponentContext/FixedComponentProvider'
import { User } from 'realm-web'
import { useUserCheck } from 'hooks/useUserCheck'
import useGetStoreInfo from 'hooks/useGetStoreInfo'
import { useUser } from 'contexts/userContext/User'
import TransactionList from 'components/TransactionList'

const StyledNav: React.FC = ({ children }) => {
  const useStyles = createStyles((theme, _Params, getRef) => ({
    styledNav: {
      position: 'fixed',
      top: 0,
      left: 0,
      transition: 'top 0.2s',
      display: 'flex',
      [theme.fn.largerThan(900)]: {
        flexDirection: 'row-reverse',
      },
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: '8px',
      paddingRight: '16px',
      width: '100%',
      height: `${MENU_HEIGHT}px`,

      borderBottom: 'solid 2px rgba(133, 133, 133, 0.1)',
      zIndex: 20,
      transform: 'translate3d(0, 0, 0)',
    },
  }))

  const { classes } = useStyles()
  return <nav className={classes.styledNav}>{children}</nav>
}

const Wrapper: React.FC = ({ children }) => {
  const useStyles = createStyles((theme, _Params, getRef) => ({
    wrapper: {
      position: 'relative',

      width: '100%',
    },
  }))
  const { classes } = useStyles()
  return <Box className={classes.wrapper}>{children}</Box>
}

const BodyWrapper: React.FC = ({ children }) => {
  const useStyles = createStyles((theme, _Params, getRef) => ({
    bodyWrapper: {
      position: 'relative',

      display: 'flex',
    },
  }))
  const { classes } = useStyles()
  return <Box className={classes.bodyWrapper}>{children}</Box>
}

const Inner: React.FC<{ showMenu: boolean; isMobile: boolean; loggedIn: boolean }> = ({
  children,
  showMenu,
  isMobile,
  loggedIn,
}) => {
  const useStyles = createStyles((theme, { showMenu }: { showMenu: boolean }, getRef) => ({
    inner: {
      flexGrow: 1,
      marginTop: `${showMenu ? `${MENU_HEIGHT}px` : 0}`,
      transition: 'margin-top 0.2s',
      transform: 'translate3d(0, 0, 0)',

      maxWidth: '100%',

      marginLeft: `${!isMobile && loggedIn ? SIDEBAR_WIDTH_FULL : 0}px`,

      // maxWidth: `${`calc(100% - ${
      //   isMobile ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED
      // }px)`}`,
    },
  }))
  const { classes } = useStyles({ showMenu })
  return <Box className={classes.inner}>{children}</Box>
}

const Menu: React.FC = ({ children }) => {
  useUserCheck()
  const isXl = useMediaQuery('(min-width: 900px)')
  const isMobile = isXl === false
  // const { user, logOut } = useRealmApp()
  const { userDocument, loggedIn, signOut } = useUser()
  const { data } = useGetStoreInfo()
  const [visible, setVisible] = useState(false)

  const location = useLocation()
  const [, scrollTo] = useWindowScroll()
  const theme = useMantineTheme()
  const { i18n } = useTranslation()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const { links, lngs, list: avatarList } = useConfigData()
  const storeName = loggedIn ? userDocument?.storeName : ''
  const { mutate: openAdnCloseStore } = useStoreStateControl()
  useEffect(() => {
    scrollTo({ x: 0, y: 0 })
  }, [location])
  const sales = data?.sales?.toFixed(2)
  console.log('🚀 ~ file: Menu.tsx:138 ~ data', data)

  const [fixedComponent] = useFixedComponent()
  const FixedComponenet = fixedComponent.length > 0 ? fixedComponent[0] : undefined

  const [opened, setOpened] = useState(false)
  return (
    <Wrapper>
      <StyledNav>
        {isMobile && loggedIn && <Burger opened={opened} onClick={() => setOpened((prevState) => !prevState)} />}
        {loggedIn && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {!isMobile && (
              <Card
                shadow={'lg'}
                p={'xs'}
                // m={'0px 4px'}
              >
                <Group sx={{}} position="apart">
                  <Text>{t('Sales')}</Text>:<Text>{sales || 0}</Text>
                </Group>{' '}
              </Card>
            )}
            <Card
              shadow={'lg'}
              p={'xs'}
              // m={'0px 4px'}
            >
              <Group position="apart">
                <Text>{t('status')}</Text>:
                <Badge color={userDocument?.opened ? 'green' : 'red'}>
                  {userDocument?.opened ? t('Open') : t('Closed')}
                </Badge>
              </Group>
            </Card>

            {loggedIn && (
              <AvatarMenu
              // sx={{
              //   maxWidth: isMobile ? '120px' : '',
              // }}
              >
                <AvatarMenu.Target>
                  <Box
                    p={'xs'}
                    m={'0px 4px'}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      maxWidth: isMobile ? '120px' : '',
                    }}
                  >
                    <Avatar
                      // sx={{
                      //   width: 'fit-content',
                      //   maxWidth: isMobile ? '120px' : '',
                      // }}
                      alt={storeName}
                    />
                    <Text
                      weight={500}
                      sx={{
                        padding: '1px 4px',
                        overflow: 'hidden',
                      }}
                    >
                      {storeName}
                    </Text>
                  </Box>
                </AvatarMenu.Target>
                {/* {avatarList.map((avatarItem) => {
                const Icon = avatarItem.icon;
                return (
                  <AvatarMenu.Item
                  onClick={async () => await avatarItem.fn()}
                  icon={<Icon />}
                  >
                  {avatarItem.label}
                  </AvatarMenu.Item>
                  );
                })} */}
                <AvatarMenu.Dropdown>
                  <AvatarMenu.Item
                    onClick={() => {
                      openAdnCloseStore()
                    }}
                  >
                    {userDocument?.opened ? t('Close store') : t('Open store')}
                  </AvatarMenu.Item>
                  <AvatarMenu.Item
                    onClick={async () => {
                      setVisible(true)
                      await signOut()
                      setVisible(false)
                    }}
                    icon={<MdLogout />}
                  >
                    {t('Log out')}
                  </AvatarMenu.Item>
                </AvatarMenu.Dropdown>
              </AvatarMenu>
            )}
          </Box>
        )}
      </StyledNav>

      <Group
        grow
        sx={{
          position: 'fixed',
          bottom: '0px',
          width: '100%',
          marginLeft: !isMobile ? `${SIDEBAR_WIDTH_FULL}px` : '',
          zIndex: 3,
        }}
      >
        {fixedComponent.length > 0 &&
          (location.pathname.includes('bulkupdate') || location.pathname.includes('optionstable')) && (
            <FixedComponenet />
          )}
      </Group>
      <BodyWrapper>
        <LoadingOverlay
          sx={{
            height: '100vh',
          }}
          visible={visible}
        />
        {!isMobile && loggedIn && <Panel lngs={lngs} showMenu links={links} activeLink={location.pathname} />}
        {isMobile && loggedIn && (
          <Drawer
            withCloseButton={false}
            size="sm"
            zIndex={4}
            padding={'sm'}
            opened={opened}
            onClose={() => {
              setOpened(false)
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '90%',

                overflow: 'auto',
              }}
              mt={MENU_HEIGHT}
            >
              <Box
                sx={{
                  height: 'fit-content',
                }}
              >
                {links.map((section) => {
                  const Icon = section.icon
                  if (section.link) {
                    return (
                      <UnstyledButton
                        component={Link}
                        to={section.link}
                        key={section.label}
                        sx={(theme) => ({
                          padding: ' 12px 12px',
                          textDecoration: 'none',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          fontWeight: 500,
                          color: location.pathname === section.link ? theme.primaryColor : '-moz-initial',
                          '&:hover': {
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
                          },
                        })}
                      >
                        <Icon
                          style={{
                            marginRight: theme.spacing.md,
                          }}
                        />{' '}
                        {section.label}
                      </UnstyledButton>
                    )
                  }
                  return (
                    <Accordion
                      // sx={{
                      //   display: 'flex',
                      //   flexDirection: 'column',
                      //   justifyContent: 'space-between',

                      //   width: '100%',
                      // }}
                      chevron={<></>}
                    >
                      <Accordion.Item
                        sx={{
                          border: '0px',
                        }}
                        value={section.label}
                      >
                        <Accordion.Control icon={<Icon />}>{section.label}</Accordion.Control>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}
                        >
                          {section.items.map((item) => (
                            <UnstyledButton
                              component={Link}
                              to={item.link}
                              key={item.label}
                              sx={(theme) => ({
                                padding: ' 12px 12px',
                                textDecoration: 'none',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                fontWeight: 500,
                                color: location.pathname.includes(item.link.toLowerCase().trim())
                                  ? theme.primaryColor
                                  : '-moz-initial',
                                '&:hover': {
                                  backgroundColor:
                                    theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
                                },
                              })}
                            >
                              {item.label}
                            </UnstyledButton>
                          ))}
                        </Box>
                      </Accordion.Item>
                    </Accordion>
                  )
                })}
                <TransactionList menu />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'end',
                }}
              >
                <AvatarMenu>
                  <AvatarMenu.Target>
                    <ActionIcon>
                      <MdLanguage />
                    </ActionIcon>
                  </AvatarMenu.Target>
                  <AvatarMenu.Dropdown>
                    {Object.keys(lngs).map((lang) => (
                      <AvatarMenu.Item
                        onClick={() => {
                          i18n.changeLanguage(lang)
                        }}
                      >
                        {lngs[lang].nativeName}
                      </AvatarMenu.Item>
                    ))}
                  </AvatarMenu.Dropdown>
                </AvatarMenu>
                <Space
                  sx={{
                    width: '12px',
                  }}
                />
                <ActionIcon
                  variant="outline"
                  color={dark ? 'yellow' : 'blue'}
                  onClick={() => toggleColorScheme()}
                  title="Toggle color scheme"
                >
                  {dark ? <BsSun size={18} /> : <BsMoonStars size={18} />}
                </ActionIcon>
              </Box>
            </Box>
          </Drawer>
        )}{' '}
        <Inner showMenu isMobile={isMobile} loggedIn={loggedIn}>
          {children}
        </Inner>
      </BodyWrapper>
    </Wrapper>
  )
}
export default Menu
