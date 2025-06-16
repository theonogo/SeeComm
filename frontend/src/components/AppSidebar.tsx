import { Home, Newspaper, ChevronDown, User, Moon, Sun, LogOut } from "lucide-react"
import { NavLink } from 'react-router-dom';
import { useLocation } from "react-router-dom";

 
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

import { useEffect } from 'react'

import { useAuth } from '../auth/AuthContext';
import { useTheme } from "@/components/ThemeProvider"
import { Toggle } from "@/components/ui/toggle"
import { useNavigate } from 'react-router-dom';
import { useTutorialsContext } from "@/utils/TutorialsContext";
  
 
export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation();
  const { tutorials, refetch } = useTutorialsContext();
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    refetch()
  }, [])


  const { theme, setTheme } = useTheme()

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
                <SidebarMenuButton 
                  isActive={location.pathname==`/`}
                  asChild
                >
                  <NavLink to='/'>
                    <Home />
                    <span>Home</span>
                  </NavLink>
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
                  <SidebarMenuButton 
                    isActive={location.pathname==`/tutorial/${tutorial.id}/`}
                    asChild
                  >
                    <NavLink 
                      to={`/tutorial/${tutorial.id}/`}
                    >
                      <Newspaper />
                      <span>{tutorial.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton  className="text-center justify-center bg-primary/20 hover:bg-primary/60 mt-2" asChild>
                  <NavLink 
                    to={`/upload/`}
                    className="text-center"
                  >
                    + Upload New Tutorial
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
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