import { DeleteButton, SaveButton, ToggleButton, UpdateButton } from "@/shared/components/button/Button"
import Form from "@/shared/components/form/Form"
import FormField from "@/shared/components/form/FormField"
import Spacing from "@/shared/components/spacing/Spacing"
import Table from "@/shared/components/table/Table"
import TableBody from "@/shared/components/table/TableBody"
import TableCell from "@/shared/components/table/TableCell"
import TableColumn from "@/shared/components/table/TableColumn"
import TableHead from "@/shared/components/table/TableHead"
import TableRow from "@/shared/components/table/TableRow"
import Toast from "@/shared/components/toast/Toast"
import { truncateText } from "@/shared/utils/string"
import { usePlatformStore } from "@/store/platformStore"
import { useEffect, useState } from "react"
import { PlatformService } from "../service/platformService"
import { Platform } from "../types/platform"
import './platformSettingPage.css'

const PlatformSettingPage = () => {
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [formData, setFormData] = useState<Platform>({
        name: '',
        apiUrl: '',
        apiKey: '',
        path: '',
        icon: '',
        sortOrder: 0,
        isActive: false,
    })
    const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({
        show: false,
        message: '',
        type: 'error'
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'error') => {
        setToast({ show: true, message, type });
    };

    // 초기 데이터 로드
    useEffect(() => {
        loadPlatforms();
    }, []);

    const loadPlatforms = async () => {
        try {
            const data = await PlatformService.getAll();
            setPlatforms(data);
        } catch (error) {
            showToast('데이터 로드에 실패했습니다.', 'error');
            console.error('Load Error:', error);
        }
    };

    const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.stopPropagation();
        try {
            const platform = platforms[index];
            const newIsActive = !platform.isActive;
            
            await PlatformService.toggleActive(platform.id!, newIsActive);
            await loadPlatforms(); // DB에서 최신 데이터 다시 로드
            await usePlatformStore.getState().refreshMenus();
            
            showToast('상태가 변경되었습니다.', 'success');
        } catch (error) {
            showToast('상태 변경에 실패했습니다.', 'error');
            console.error('Toggle Error:', error);
        }
    }

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.stopPropagation();
        try {
            const platform = platforms[index];
            await PlatformService.delete(platform.id!);
            
            const updatedPlatforms = [...platforms];
            updatedPlatforms.splice(index, 1);
            setPlatforms(updatedPlatforms);
            showToast('성공적으로 삭제되었습니다.', 'success');
        } catch (error) {
            showToast('삭제에 실패했습니다.', 'error');
            console.error('Delete Error:', error);
        }
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        
        // number 타입인 경우 앞의 0 제거
        const processedValue = e.target.type === 'number' ? 
            value.replace(/^0+/, '') || '0' : 
            value;
        
        setFormData(prevData => ({ ...prevData, [id]: processedValue }));
    }

    const handleRowClick = (platform: Platform) => {
        setSelectedId(platform.id);
        setFormData({
            id: platform.id,
            name: platform.name,
            apiUrl: platform.apiUrl,
            apiKey: platform.apiKey,
            path: platform.path,
            icon: platform.icon,
            sortOrder: platform.sortOrder,
            isActive: platform.isActive
        });
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            showToast('메뉴 이름은 필수입니다.');
            return;
        }
        
        if (!formData.sortOrder) {
            showToast('순서는 필수입니다.');
            return;
        }

        if (formData.sortOrder < 0) {
            showToast('순서는 1 이상이어야 합니다.');
            return;
        }

        try {
            if (selectedId) {
                await PlatformService.update(selectedId, formData);
                const updatedPlatforms = platforms.map(platform => 
                    platform.id === selectedId ? { ...formData } : platform
                );
                setPlatforms(updatedPlatforms.sort((a, b) => {
                    const orderDiff = a.sortOrder - b.sortOrder;
                    return orderDiff !== 0 ? orderDiff : a.name.localeCompare(b.name);
                }));
                showToast('성공적으로 수정되었습니다.', 'success');
            } else {
                await PlatformService.create(formData);
                await loadPlatforms(); // 새로운 ID를 포함한 전체 데이터 다시 로드
                showToast('성공적으로 저장되었습니다.', 'success');
            }

            setSelectedId(undefined);
            setFormData({
                name: '',
                apiUrl: '',
                apiKey: '',
                path: '',
                icon: '',
                sortOrder: 0,
                isActive: false,
            });
        } catch (error) {
            showToast(selectedId ? '수정에 실패했습니다.' : '저장에 실패했습니다.', 'error');
            console.error('Save Error:', error);
        }
    }

    return (
        <>
            <Spacing height="2rem" />
            <div className="setting-page">
                <div className="table-part">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableColumn>메뉴 이름</TableColumn>
                                <TableColumn>api url</TableColumn>
                                <TableColumn>api key</TableColumn>
                                <TableColumn>순서</TableColumn>
                                <TableColumn>활성 삭제</TableColumn>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {platforms.map((platform, index) => (
                                <TableRow 
                                    key={index} 
                                    onClick={() => handleRowClick(platform)}
                                >
                                    <TableCell>{platform.name}</TableCell>
                                    <TableCell>{truncateText(platform.apiUrl, 20)}</TableCell>
                                    <TableCell>{truncateText(platform.apiKey, 6)}</TableCell>
                                    <TableCell>{platform.sortOrder}</TableCell>
                                    <TableCell
                                    className="button-cell"
                                >
                                    <ToggleButton 
                                        isActive={platform.isActive} 
                                        onToggle={(e) => handleToggle(e, index)} 
                                    />
                                    <DeleteButton onClick={(e) => handleDelete(e, index)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>  
                </div>
                <div className="form-part">
                    <Form>
                        <FormField
                        label="메뉴 이름"
                        htmlFor="name"
                        required
                        >
                            <input 
                                type="text" 
                                id="name" 
                                onChange={handleFormChange} 
                                value={formData.name}
                            />
                        </FormField>
                        <FormField
                        label="api-url"
                        htmlFor="apiUrl"
                        >
                            <input 
                                type="text" 
                                id="apiUrl"
                                onChange={handleFormChange} 
                                value={formData.apiUrl}
                            />
                        </FormField>
                        <FormField
                        label="api-key"
                        htmlFor="apiKey"
                        >
                            <input 
                                type="text" 
                                id="apiKey"
                                onChange={handleFormChange} 
                                value={formData.apiKey}
                            />
                        </FormField>    
                        <FormField
                        label="순서"
                        htmlFor="sortOrder"
                        required
                        >
                            <input 
                                type="number" 
                                id="sortOrder" 
                                onChange={handleFormChange} 
                                value={formData.sortOrder}
                            />
                        </FormField>
                        <Spacing height="1rem" />   
                        {selectedId ? <UpdateButton onClick={handleSave} /> : <SaveButton onClick={handleSave} />}
                    </Form>
                </div>
                {toast.show && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(prev => ({ ...prev, show: false }))}
                    />
                )}
            </div>
        </>
    )
}

export default PlatformSettingPage
