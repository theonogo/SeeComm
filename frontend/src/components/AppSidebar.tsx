import { Home, Newspaper, ChevronDown, User, Moon, Sun, LogOut } from "lucide-react"
import { Link } from 'react-router-dom';
 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useEffect, useState } from 'react'
import api from '../api'

import { useAuth } from '../auth/AuthContext';
import { useTheme } from "@/components/ThemeProvider"
import { Toggle } from "@/components/ui/toggle"
import { useNavigate } from 'react-router-dom';
  
 
export function AppSidebar() {
  const [tutorials, setTutorials] = useState<Array<{ id: string, title: string }>>([])
  const navigate = useNavigate()
  const context = useAuth()
  const { user } = context

  const handleLogout = async () => {
    try {
      await context.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {

    api.get('/tutorials/')
      .then((res) => {
        console.log(res)
        setTutorials(res.data)
      })
  }, [])


  const { theme, setTheme } = useTheme()
  console.log(theme)

  return (
    <Sidebar>
      <div className="h-4"></div>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User />
                  <span>{user?.username || 'User'}</span>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
                <DropdownMenuItem onClick={() => {handleLogout()}} className="cursor-pointer">
                  <LogOut/>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <div className='h-2' />
        <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href='/'>
                    <Home />
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Tutorials</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tutorials.map((tutorial) => (
                <SidebarMenuItem key={tutorial.id}>
                  <SidebarMenuButton asChild>
                    <Link to={`/tutorials/${tutorial.id}`}>
                      <Newspaper />
                      <span>{tutorial.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-start gap-2">
          <Toggle
            defaultPressed={theme === "light"}
            onPressedChange={(pressed) => {
              setTheme(pressed ? "light" : "dark" )
            }}
            size="lg"
          >
            {theme === "dark" ? <Moon /> : <Sun />}
          </Toggle>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}